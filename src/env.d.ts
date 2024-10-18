/// <reference path="../.astro/types.d.ts" />

declare namespace App {
  interface Locals {
    user: {
      id: number;
      company_id: number;
      firstname: string;
      lastname: string;
      email: string;
      role: string;
    } | null;
  }
}
