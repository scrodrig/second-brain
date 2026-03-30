"use server";

import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { z } from "zod";

const RegisterSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

export async function registerUser(data: z.infer<typeof RegisterSchema>) {
  const parsed = RegisterSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid data");

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) throw new Error("Email already registered");

  const hash = await bcrypt.hash(parsed.data.password, 12);

  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      password: hash,
    },
  });

  const household = await prisma.household.create({
    data: { name: `${parsed.data.name}'s Household` },
  });

  await prisma.householdMember.create({
    data: { userId: user.id, householdId: household.id, role: "OWNER" },
  });

  return { success: true };
}
