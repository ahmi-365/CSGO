"use client";
import React, { useState, FormEvent, ChangeEvent } from "react";
import PageContainer from "@/app/components/PageContainer";
import Input from "@/app/components/ui/Input";
import Toster from "@/app/components/Toster";

type Props = {};

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

export default function Page({}: Props) {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const fullName = `${formData.firstName} ${formData.lastName}`.trim();

    if (
      !fullName ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    const apiPayload = {
      name: fullName,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/support/send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiPayload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      setSuccess(true);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err: any) {
      setError(err.message || "Failed to send message. Please try again.");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <div className="max-w-157.5 mx-auto">
        <h4 className="text-2xl text-white font-satoshi font-bold leading-[130%] mb-4 md:mb-5">
          Support
        </h4>
        <form
          onSubmit={handleSubmit}
          className="p-5 md:p-6 rounded-2xl md:rounded-3xl bg-white/6 border border-solid border-white/25 flex flex-col gap-y-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-3 lg:gap-4">
            <Input
              className="mb-0"
              inputClass="!bg-[#171925]/16 !text-white placeholder:!text-white/80 !px-4 min-h-12 border border-solid border-white/12 focus:border-[#C8D0FF]"
              type="text"
              labelClass="!font-medium"
              label="First Name"
              placeholder="Johan"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
            <Input
              className="mb-0"
              inputClass="!bg-[#171925]/16 !text-white placeholder:!text-white/80 !px-4 min-h-12 border border-solid border-white/12 focus:border-[#C8D0FF]"
              type="text"
              labelClass="!font-medium"
              label="Last Name"
              placeholder="Smith"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          <Input
            className="mb-0"
            inputClass="!bg-[#171925]/16 !text-white placeholder:!text-white/80 !px-4 min-h-12 border border-solid border-white/12 focus:border-[#C8D0FF]"
            type="email"
            labelClass="!font-medium"
            label="Email"
            placeholder="johansmith_100@gmail.com"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <Input
            className="mb-0"
            inputClass="!bg-[#171925]/16 !text-white placeholder:!text-white/80 !px-4 min-h-12 border border-solid border-white/12 focus:border-[#C8D0FF]"
            type="text"
            labelClass="!font-medium"
            label="Subject"
            placeholder="Issue with my case purchase"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
          />
          <Input
            className="!mb-0"
            type="textarea"
            label="Message"
            inputClass="w-full bg-[#171925]/16 border border-white/12 rounded-xl py-3 px-5 h-36 resize-none text-sm md:text-base text-white placeholder:text-white/50 mb-4 md:mb-5"
            placeholder="Type here..."
            name="message"
            value={formData.message}
            onChange={handleChange}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full gradient-border-two rounded-full p-px overflow-hidden shadow-[0_4px_8px_0_rgba(59,188,254,0.32)] text-sm md:text-base min-h-13 md:min-h-15 flex items-center justify-center text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>

      {/* Success Toaster */}
      {success && (
        <Toster
          variant="success"
          title="Message Sent!"
          description="We have received your message and will get back to you."
          duration={5000} // Added duration
          onClick={() => setSuccess(false)}
        />
      )}

      {/* Error Toaster */}
      {error && (
        <Toster
          variant="error"
          title="Submission Failed"
          description={error}
          duration={5000} // FIX: Added required duration prop
          onClick={() => setError(null)}
        />
      )}
    </PageContainer>
  );
}
