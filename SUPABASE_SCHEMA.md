# Supabase Schema for UpToDate

This document outlines the Supabase database schema used for the UpToDate application, including tables for entity management and the daily tracing environment.

## Tables

### 1. `items`
Stores the core entities (Products, Services, Campaigns, R&D Projects) and their hierarchical tree structures.

```sql
CREATE TABLE items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL, -- 'Product', 'Service', 'Campaign', 'R&D Project'
    name TEXT NOT NULL,
    link TEXT,
    description TEXT,
    stakeholders TEXT,
    details JSONB, -- Stores positioning, valueProp, vision, goals
    tree_data JSONB, -- Stores the full React Flow nodes and edges state
    sub_products JSONB, -- Stores the hierarchical nested structure
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2. `tracing_config`
Manages the configuration for which item is currently being actively traced.

```sql
CREATE TABLE tracing_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID REFERENCES items(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3. `generated_prompts`
Stores the history of generated system prompts for the High-Level LLM, including a snapshot of the data used at the time of generation.

```sql
CREATE TABLE generated_prompts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID REFERENCES items(id) ON DELETE CASCADE,
    config_id UUID REFERENCES tracing_config(id) ON DELETE CASCADE,
    prompt_content TEXT NOT NULL,
    source_data_snapshot JSONB, -- Snapshot of the item data (tree/details) when this was generated
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Realtime Configuration
The application uses Supabase Realtime to listen for updates on the `items` table to automatically regenerate prompts when a traced item's data changes.

To enable this, ensure Reallocation is enabled for the `public.items` table in the Supabase Dashboard.

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE items;
```
