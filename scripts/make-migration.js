import fs from "fs";

const [, , name] = process.argv;

if (!name) {
    console.log("Usage: npm run create-migration <name>");
}

fs.mkdirSync("database/migrations", { recursive: true });

const date = new Date();

const fileName = `${String(date.getDate()).padStart(2, "0")}${String(
    date.getMonth() + 1
).padStart(2, "0")}${String(date.getFullYear()).padStart(2, "0")}_${String(
    date.getHours()
).padStart(2, "0")}${String(date.getMinutes()).padStart(2, "0")}${String(
    date.getSeconds()
).padStart(2, "0")}`;
// console.log(fileName);

const template = `import { Kysely } from "kysely";

export const up = async (db: Kysely<any>): Promise<void> => {
    //TODO
};

export const down = async (db: Kysely<any>): Promise<void> => {
    //TODO
};
`;

fs.writeFileSync(
    `database/migrations/${fileName}_${name}.ts`,
    template,
    "utf-8"
);

console.log("Created migration: ", name);
