/* eslint-disable prefer-const */
import { Pinecone } from "@pinecone-database/pinecone";
import { downloadFromS3 } from "./s3-getpdf";
//PDFLoader in LangChain is used to extract and convert the content of a PDF file into plain text documents,
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import {
  Document,
  RecursiveCharacterTextSplitter,
} from "@pinecone-database/doc-splitter";
import { getEmbedding } from "./embedding";
import md5 from "md5";
import { Vector } from "@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data";
import { convertToAscii } from "@/lib/utils";

let pineconeClient: Pinecone | null = null;

export const getPineconeClient = async () => {
  if (!pineconeClient) {
    pineconeClient = new Pinecone({
      apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY as string,
    });
  }
  return pineconeClient;
};

type PDFPage = {
  pageContent: string;
  metadata: {
    loc: { pageNumber: number };
  };
};

export async function loadS3IntoPinecone(fileKey: string) {
  try {
    //1 obtain the pdf--download and read from pdf
    console.log("downloading s3 into file system");
    const file_name = await downloadFromS3(fileKey);
    if (!file_name) {
      throw new Error("could not download from s3");
    }

    const loader = new PDFLoader(file_name);
    const pages = (await loader.load()) as PDFPage[];
    console.log("🚀 ~ loadS3IntoPinecone ~ loader:", loader);
    //2. split and segments the pdf into documentation
    //if the page has 13Array after calling the prepareDocument array it may convert into the 100Array
    const document = await Promise.all(
      pages.map((pages) => prepareDocument(pages))
    );

    //3. step is vectorize and embedded individual document
    const vectors = await Promise.all(document.flat().map(embedDocument));

    //upload to pinecone
    const client = await getPineconeClient();
    const pineconeIndex = client.Index("chatwithpdf");
    console.log("🚀 ~ inserting vector ~ pineconeIndex:");
    //remove non ascii character
    const namespace = convertToAscii(fileKey);
    PineconeUtils.chunkedUpsert(pineconeIndex, vectors, namespace, 10);
    return document[0];
  } catch (error) {
    console.log("🚀 ~ loadS3IntoPinecone ~ error:", error);
  }
}

//3 step
async function embedDocument(doc: Document) {
  try {
    const embedding = await getEmbedding(doc.pageContent);
    const hash = md5(doc.pageContent);
    return {
      id: hash,
      values: embedding,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber,
      },
    } as Vector;
  } catch (error) {
    console.log("🚀 ~ embedDocument ~ error:", error);
    throw error;
  }
}

//2.2 rd step is doing if because if the text is more then it is difficult to handle in prepareDocument of pinecone
export const truncateStringByBytes = (str: string, bytes: number) => {
  const encoder = new TextEncoder();
  return new TextDecoder("utf-8").decode(encoder.encode(str).slice(0, bytes));
};

//step 2.1 doing here
async function prepareDocument(page: PDFPage) {
  let { pageContent, metadata } = page;
  pageContent = pageContent.replace(/\n/g, "");
  //split the text
  const splitter = new RecursiveCharacterTextSplitter();
  //splitter will split into original document into smaller document
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateStringByBytes(pageContent, 30000),
      },
    }),
  ]);
  return docs;
}
