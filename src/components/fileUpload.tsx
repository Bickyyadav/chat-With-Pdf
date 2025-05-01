"use client";
import { uploadToS3 } from "@/config/s3";
import { useMutation } from "@tanstack/react-query";
import { Inbox, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import axios from "axios";

const FileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const mutation = useMutation({
    mutationFn: async ({
      file_key,
      file_name,
    }: {
      file_key: string;
      file_name: string;
    }) => {
      const response = await axios.post("/api/create-chat", {
        file_key,
        file_name,
      });
      return response.data;
    },
  });
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (acceptFile) => {
      const file = acceptFile[0];
      if (file.size > 10 * 1024 * 1024) {
        toast.error("please upload smaller file less than 10 mb");
        return;
      }
      try {
        setUploading(true);
        const data = await uploadToS3(file);
        if (!data?.file_key || !data?.file_name) {
          alert("something went wrong");
          return;
        }
        mutation.mutate(data, {
          onSuccess: (data) => {
            console.log(data);
          },
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          onError: (err) => {
            toast.error("Error creating chat");
          },
        });
      } catch (error) {
        console.log("🚀 ~ onDrop: ~ error:", error);
      } finally {
        setUploading(false);
      }
    },
  });

  return (
    <div className="p-2 bg-white rounded-xl">
      <div
        {...getRootProps({
          className:
            "border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col",
        })}
      >
        <input {...getInputProps()} />
        {uploading || mutation.isPending ? (
          <>
            <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
            <p className="mt-2 text-sm text-slate-400">Spilling to GPT....</p>
          </>
        ) : (
          <>
            <Inbox className="w-10 h-10 text-blue-500" />
            <p className="mt-2 text-sm text-slate-300">Drop PDF HERE</p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
