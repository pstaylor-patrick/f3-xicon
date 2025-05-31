CREATE TYPE "public"."item_type" AS ENUM('exercise', 'term');--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "thumbnail_url" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "type" "item_type" NOT NULL;