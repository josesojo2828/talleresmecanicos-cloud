-- CreateTable
CREATE TABLE "_PublicationToCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PublicationToCategory_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ForumToCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ForumToCategory_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PublicationToCategory_B_index" ON "_PublicationToCategory"("B");

-- CreateIndex
CREATE INDEX "_ForumToCategory_B_index" ON "_ForumToCategory"("B");

-- AddForeignKey
ALTER TABLE "_PublicationToCategory" ADD CONSTRAINT "_PublicationToCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "publications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PublicationToCategory" ADD CONSTRAINT "_PublicationToCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "workshop_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ForumToCategory" ADD CONSTRAINT "_ForumToCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "forum_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ForumToCategory" ADD CONSTRAINT "_ForumToCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "workshop_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
