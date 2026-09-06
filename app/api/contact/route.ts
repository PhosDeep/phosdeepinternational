import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

type ContactPayload = {
  name?: string;
  email?: string;
  phone?: string;
  organization?: string;
  designation?: string;
  enquiryType?: string;
  technology?: string;
  message?: string;
  website?: string;
};

const enquiryTypes = new Set([
  "Technology / Consulting",
  "Corporate Training",
  "University / Academic Program",
  "Research Collaboration",
  "Internship / Career",
  "Other",
]);

const technologies = new Set([
  "Cybersecurity",
  "Artificial Intelligence",
  "Generative AI",
  "Quantum Computing",
  "Blockchain",
  "Cloud Computing",
  "Data Science",
  "Other",
]);

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function withinLimit(value: string | null | undefined, limit: number) {
  return value == null || value.length <= limit;
}

export async function POST(request: Request) {
  try {
    const parsedBody = await request.json();

    if (!parsedBody || typeof parsedBody !== "object" || Array.isArray(parsedBody)) {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const body = parsedBody as ContactPayload;

    if (body.website) {
      return NextResponse.json({ success: true }, { status: 201 });
    }

    if (Object.values(body).some((value) => value !== undefined && !isString(value))) {
      return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
    }

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

    if (
      !withinLimit(name, 120) ||
      !withinLimit(email, 254) ||
      !withinLimit(phone, 40) ||
      !withinLimit(organization, 160) ||
      !withinLimit(designation, 120) ||
      !withinLimit(message, 4000)
    ) {
      return NextResponse.json({ error: "One or more fields are too long." }, { status: 400 });
    }

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

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
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

    if (!enquiryTypes.has(enquiryType)) {
      return NextResponse.json({ error: "Please select a valid enquiry type." }, { status: 400 });
    }

    if (technology && !technologies.has(technology)) {
      return NextResponse.json({ error: "Please select a valid technology area." }, { status: 400 });
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
      await getSupabase()
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