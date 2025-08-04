-- CreateTable
CREATE TABLE "Keyword" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Keyword_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Keyword_name_key" UNIQUE ("name")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "author" TEXT NOT NULL,
    "subreddit" TEXT NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Post_url_key" UNIQUE ("url")
);

-- CreateTable
CREATE TABLE "_KeywordToPost" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_KeywordToPost_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_KeywordToPost_B_index" ON "_KeywordToPost"("B");

-- AddForeignKey
ALTER TABLE "_KeywordToPost" ADD CONSTRAINT "_KeywordToPost_A_fkey" FOREIGN KEY ("A") REFERENCES "Keyword"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_KeywordToPost" ADD CONSTRAINT "_KeywordToPost_B_fkey" FOREIGN KEY ("B") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;


