ALTER TABLE "menu_items" ADD COLUMN "price_variants" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "menu_items" ADD COLUMN "sold_out_on" date;