import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

type ContactPayload = {
  name?: string;
  email?: string;
  phone?: string;
  organization?: string;
  designation?: string;
  enquiryType?: string;
  technology?: string;
  message?: string;
};

export async function POST(request: Request) {
  try {
    const body =
      (await request.json()) as ContactPayload;

    const name = body.name?.trim();
    const email = body.email?.trim();
    const phone = body.phone?.trim() || null;
    const organization =
      body.organization?.trim() || null;
    const designation =
      body.designation?.trim() || null;
    const enquiryType =
      body.enquiryType?.trim();
    const technology =
      body.technology?.trim() || null;
    const message = body.message?.trim();

    if (!name) {
      return NextResponse.json(
        {
          error: "Please enter your name.",
        },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        {
          error: "Please enter your email address.",
        },
        { status: 400 }
      );
    }

    if (!enquiryType) {
      return NextResponse.json(
        {
          error:
            "Please select what you are looking for.",
        },
        { status: 400 }
      );
    }

    if (!message) {
      return NextResponse.json(
        {
          error:
            "Please tell us a little about your requirement.",
        },
        { status: 400 }
      );
    }

    const { error } =
      await supabase
        .from("contact_submissions")
        .insert({
          name,
          email,
          phone,
          organization,
          designation,
          enquiry_type: enquiryType,
          technology,
          message,
        });

    if (error) {
      console.error(
        "Supabase contact submission error:",
        error
      );

      return NextResponse.json(
        {
          error:
            "We couldn't submit your enquiry right now. Please try again.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
      },
      { status: 201 }
    );

  } catch (error) {

    console.error(
      "Contact API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}