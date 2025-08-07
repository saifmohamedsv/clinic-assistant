"use server";

import { signIn } from "@/lib/auth";
import { executeAction } from "@/lib/executeAction";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const signInAction = async (formData: FormData) => {
  return executeAction({
    actionFn: async () => {
      await signIn("credentials", {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        redirect: false,
      });
    },
  });
};

const signUpAction = async (formData: FormData) => {
  return executeAction({
    actionFn: async () => {
      const hashedPassword = await bcrypt.hash(formData.get("password") as string, 10);
      await prisma.user.create({
        data: {
          email: formData.get("email") as string,
          name: formData.get("name") as string,
          role: formData.get("role") as Role,
          password: hashedPassword,
        },
      });
    },
  });
};

export { signInAction, signUpAction };
