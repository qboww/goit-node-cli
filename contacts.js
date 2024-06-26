import fs from "fs/promises";
import path from "node:path";
import { nanoid } from "nanoid";

const contactsPath = path.resolve("db", "contacts.json");

const readContactsFile = async () => {
  try {
    const fileData = await fs.readFile(contactsPath, "utf-8");

    return JSON.parse(fileData);
  } catch (error) {
    return [];
  }
};

export const listContacts = async () => console.table(await readContactsFile());

export const getContactById = async (contactId) => {
  try {
    const contactsList = await readContactsFile();
    const contactToFind = contactsList.find((c) => c.id === contactId);

    if (!contactToFind) {
      return null;
    }

    console.log(contactToFind);
    return contactToFind;
  } catch (error) {
    return null;
  }
};

export const removeContact = async (contactId) => {
  try {
    const contactsList = await readContactsFile();
    const contactToRemove = contactsList.find((c) => c.id === contactId);

    if (!contactToRemove) {
      return null;
    }

    const filteredList = contactsList.filter((c) => c.id !== contactId);
    await fs.writeFile(contactsPath, JSON.stringify(filteredList, null, 2), "utf-8");

    console.log(contactToRemove);
    return contactToRemove;
  } catch (error) {
    return null;
  }
};

export const addContact = async (name, email, phone) => {
  try {
    if (!name || !email || !phone) {
      return null;
    }

    const contactsList = await readContactsFile();
    const newContact = { id: nanoid(), name, email, phone };
    contactsList.push(newContact);

    await fs.writeFile(contactsPath, JSON.stringify(contactsList, null, 2), "utf-8");

    console.log(newContact);
    return newContact;
  } catch (error) {
    return null;
  }
};
