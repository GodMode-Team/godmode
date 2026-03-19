import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { DATA_DIR } from "../data-paths.js";
import type { GatewayRequestHandler } from "openclaw/plugin-sdk";

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

const PEOPLE_DIR = join(DATA_DIR, "people");

type Person = {
  id: string;
  name: string;
  emoji?: string;
  company?: string;
  role?: string;
  tags: string[];
  email?: string;
  phone?: string;
  birthday?: string;
  lastContact?: string;
  notes?: string;
  projects?: string[];
};

async function readPerson(id: string): Promise<Person | null> {
  try {
    const raw = await readFile(join(PEOPLE_DIR, `${id}.json`), "utf-8");
    return JSON.parse(raw) as Person;
  } catch {
    return null;
  }
}

const listPeople: GatewayRequestHandler = async ({ respond }) => {
  try {
    const files = await readdir(PEOPLE_DIR);
    const jsonFiles = files.filter((f) => f.endsWith(".json"));
    const people: Person[] = [];
    for (const file of jsonFiles) {
      try {
        const raw = await readFile(join(PEOPLE_DIR, file), "utf-8");
        people.push(JSON.parse(raw) as Person);
      } catch {
        // Skip unreadable files
      }
    }
    respond(true, { people });
  } catch {
    respond(true, { people: [] });
  }
};

const getPerson: GatewayRequestHandler = async ({ params, respond }) => {
  const { id } = params as { id?: string };
  if (!id) {
    respond(false, null, { code: "INVALID_REQUEST", message: "Missing person id" });
    return;
  }
  const person = await readPerson(id);
  respond(true, person);
};

const searchPeople: GatewayRequestHandler = async ({ params, respond }) => {
  const { query } = params as { query?: string };
  if (!query) {
    respond(false, null, { code: "INVALID_REQUEST", message: "Missing search query" });
    return;
  }
  const q = query.toLowerCase();
  try {
    const files = await readdir(PEOPLE_DIR);
    const jsonFiles = files.filter((f) => f.endsWith(".json"));
    const results: Person[] = [];
    for (const file of jsonFiles) {
      try {
        const raw = await readFile(join(PEOPLE_DIR, file), "utf-8");
        const person = JSON.parse(raw) as Person;
        const searchable = [person.name, person.company, person.role, ...(person.tags ?? [])]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (searchable.includes(q)) {
          results.push(person);
        }
      } catch {
        // Skip unreadable files
      }
    }
    respond(true, { people: results });
  } catch {
    respond(true, { people: [] });
  }
};

export const peopleDataHandlers: GatewayRequestHandlers = {
  "people.list": listPeople,
  "people.get": getPerson,
  "people.search": searchPeople,
};
