import axios from "axios";
import { prisma } from "../lib/db/prisma";

const reset = async () => {
  const keywords = await prisma.keyword.findMany();
  for (const keyword of keywords) {
    await prisma.postSaved.deleteMany({
      where: { keywords: { some: { id: keyword.id } } },
    });
  }

  for (const keyword of keywords) {
    await axios.post("http://localhost:3000/api/posts", {
      keyword: keyword.name,
      subreddit: keyword.subreddit,
    });
  }
};

reset();
