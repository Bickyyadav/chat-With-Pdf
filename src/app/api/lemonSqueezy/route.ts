// import { auth } from "@clerk/nextjs/server";
import { lemonSqueezyApiInstance } from "./endPoint";

export async function POST(req: Request) {
  try {
    const reqData = await req.json();
    if (!reqData.productId) {
      return Response.json(
        { message: "productId is required" },
        { status: 200 }
      );
    }

    // const userid = await auth();
    // console.log("🚀 ~ POST ~ userid:", userid);
    const response = await lemonSqueezyApiInstance.post("/checkouts", {
      data: {
        type: "checkouts",
        attributes: {
          checkout_data: {
            custom: {
              user_id: "123",
            },
          },
        },
        relationships: {
          store: {
            data: {
              type: "stores",
              id: process.env.LEMON_SQUEEZY_STORE_ID,
            },
          },
          variant: {
            data: {
              type: "variants",
              id: reqData.productId.toString(),
            },
          },
        },
      },
    });
    const checkoutUrl = response.data.data.attributes.url;

    console.log("🚀 ~ POST ~ checkoutUrl:", checkoutUrl);
    return Response.json({ checkoutUrl });
  } catch (error) {
    console.log("🚀 ~ POST ~ error:", error);
    Response.json({ message: "An error occured" }, { status: 500 });
  }
}
