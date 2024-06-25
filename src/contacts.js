import fs from "fs/promises";
import path from "node:path";
import { nanoid } from "nanoid";

// variable assigned to store contacts.json relative path
const contactsPath = path.resolve("src", "db", "contacts.json");

// helper func for reading JSON file that contains array of contact objects
const readContactsFile = async () => {
  try {
    const fileData = await fs.readFile(contactsPath, "utf-8");

    return JSON.parse(fileData);
  } catch (error) {
    console.error(`Error while reading contacts file: ${error}`);
    return [];
  }
};

// func that lists parsed contacts in a table format
export const listContacts = async () => console.table(await readContactsFile());

// func that gets contact based on set object id from parsed array of objects
export const getContactById = async (contactId) => {
  try {
    const contactsList = await readContactsFile();
    const contactToFind = contactsList.find((c) => c.id === contactId);

    if (!contactToFind) {
      console.log(`Contact with ID ${contactId} not found.`);
      return null;
    }

    console.log(`Contact with ID ${contactId} was found.`);
    console.log(contactToFind);
    return contactToFind;
  } catch (error) {
    console.error(`Error while fetching contact by ID ${contactId}: ${error}`);
    return null;
  }
};

// func that removes contact based on set id by filtering parsed array of objects
export const removeContact = async (contactId) => {
  try {
    const contactsList = await readContactsFile();
    const contactToRemove = contactsList.find((c) => c.id === contactId);

    if (!contactToRemove) {
      console.log(`Contact with ID ${contactId} not found.`);
      return null;
    }

    const filteredList = contactsList.filter((c) => c.id !== contactId);
    await fs.writeFile(contactsPath, JSON.stringify(filteredList, null, 2), "utf-8");

    console.log(`Contact with ID ${contactId} removed successfully.`);
    console.log(contactToRemove);
    return contactToRemove;
  } catch (error) {
    console.error(`Error removing contact with ID ${contactId}: ${error}`);
    return null;
  }
};

// func that creates, adds and writes new contact to contacts.js file
export const addContact = async (name, email, phone) => {
  try {
    if (!name || !email || !phone) {
      console.log("Please provide name, email and phone to create new contact!");
      return null;
    }

    const contactsList = await readContactsFile();
    const newContact = { id: nanoid(), name, email, phone };
    contactsList.push(newContact);

    await fs.writeFile(contactsPath, JSON.stringify(contactsList, null, 2), "utf-8");

    console.log(`Contact with ID ${newContact.id} was added successfully.`);
    console.log(newContact);
    return newContact;
  } catch (error) {
    console.error(`Error adding new contact: ${error}`);
    return null;
  }
};
