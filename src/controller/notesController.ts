import { Request, Response } from "express";
import { getDB } from "../db/connectToDB.js";
import { Collection, ObjectId } from "mongodb";
import { myCache } from "../cache/NodeCache.js";
import { notesType } from "../typeDefine/types.js";

const getNotesCollection = async () => await getDB().collection("notes");

const getAllNotes = async (req: Request, res: Response) => {
  let notes;
  const filterKey = req?.query?.filter;
  if (filterKey) {
    console.log("1");
    const notesCollection: Collection = await getNotesCollection();
    const query = { title: { $regex: filterKey, $options: "i" } };
    notes = await notesCollection.find(query).toArray();
  } else if (myCache.has("notes")) {
    console.log("2");
    notes = JSON.parse(myCache.get("notes")!);
  } else {
    console.log("3");
    const notesCollection: Collection = await getNotesCollection();
    notes = await notesCollection.find({}).toArray();
    myCache.set("notes", JSON.stringify(notes));
  }
  res.send({
    ok: true,
    status: "Success",
    result: notes,
  });
};

const addANote = async (req: Request, res: Response) => {
  const notesCollection: Collection = await getDB().collection("notes");
  const data = req?.body;
  const result = await notesCollection.insertOne(data);
  if (result.acknowledged && myCache.has("notes")) myCache.del("notes");
  res.send({ ok: true, result });
};

const updateANote = async (req: Request, res: Response) => {
  const notesCollection: Collection = await getDB().collection("notes");
  const data: notesType = req?.body;
  const query = { _id: new ObjectId(data._id) },
    options = { upsert: false };
  const updatedDoc = {
    $set: {
      title: data.title,
      description: data.description,
    },
  };
  const result = await notesCollection.updateOne(query, updatedDoc, options);
  if (result.modifiedCount > 0 && myCache.has("notes")) {
    myCache.del("notes");
  }
  res.send({ ok: true, result });
};

const getSingleNote = async (req: Request, res: Response) => {
  const notesCollection = await getNotesCollection();
  const id = req?.params?.id;
  const query = new ObjectId(id);
  const result = await notesCollection.findOne(query);
  res.send({ ok: true, result });
};

const deleteAnItem = async (req: Request, res: Response) => {
  const notesCollection = await getNotesCollection();
  const query = { _id: new ObjectId(req.params.id) };
  const result = await notesCollection.deleteOne(query);
  if (result.deletedCount > 0 && myCache.has("notes")) myCache.del("notes");
  res.send({ ok: true, result });
};
const filterNotes = async (req: Request, res: Response) => {
  const notesCollection = await getNotesCollection();
  const filterKey = req?.query?.filter;
  const query = { title: { $regex: filterKey, $options: "i" } };
  const result = await notesCollection.find(query).toArray();
  res.send({ ok: true, result });
};

export {
  getAllNotes,
  updateANote,
  addANote,
  getSingleNote,
  deleteAnItem,
  filterNotes,
};
