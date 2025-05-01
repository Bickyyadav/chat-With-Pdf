import { Pinecone } from "@pinecone-database/pinecone";
import { downloadFromS3 } from "./s3-getpdf";
//PDFLoader in LangChain is used to extract and convert the content of a PDF file into plain text documents,
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import {
  Document,
  RecursiveCharacterTextSplitter,
} from "@pinecone-database/doc-splitter";

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

export async function loadS3IntoPinecone(filekey: string) {
  //1 obtain the pdf--download and read from pdf
  console.log("downloading s3 into file system");
  const file_name = await downloadFromS3(filekey);
  if (!file_name) {
    throw new Error("could not download from s3");
  }

  const loader = new PDFLoader(file_name);
  const pages = (await loader.load()) as PDFPage[];
  console.log("🚀 ~ loadS3IntoPinecone ~ loader:", loader);
  //2. split and segments the pdf into documentation

  return pages;
}

// async function prepareDocument(page: PDFPage) {
//     let{}
// }
