/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_KeywordToPost` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_KeywordToPost" DROP CONSTRAINT "_KeywordToPost_A_fkey";

-- DropForeignKey
ALTER TABLE "_KeywordToPost" DROP CONSTRAINT "_KeywordToPost_B_fkey";

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "_KeywordToPost";

-- CreateTable
CREATE TABLE "PostSaved" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "author" TEXT NOT NULL,
    "subreddit" TEXT NOT NULL,

    CONSTRAINT "PostSaved_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_KeywordToPostSaved" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_KeywordToPostSaved_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "PostSaved_url_key" ON "PostSaved"("url");

-- CreateIndex
CREATE INDEX "_KeywordToPostSaved_B_index" ON "_KeywordToPostSaved"("B");

-- AddForeignKey
ALTER TABLE "_KeywordToPostSaved" ADD CONSTRAINT "_KeywordToPostSaved_A_fkey" FOREIGN KEY ("A") REFERENCES "Keyword"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_KeywordToPostSaved" ADD CONSTRAINT "_KeywordToPostSaved_B_fkey" FOREIGN KEY ("B") REFERENCES "PostSaved"("id") ON DELETE CASCADE ON UPDATE CASCADE;
