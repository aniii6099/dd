import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

client: MongoClient = None


async def connect_db():
    """Connect to MongoDB."""
    global client
    client = MongoClient(MONGO_URL)
    print(f"✅ Connected to MongoDB at {MONGO_URL}")


async def close_db():
    """Close MongoDB connection."""
    global client
    if client:
        client.close()
        print("❌ MongoDB connection closed.")


def get_database():
    """Return the database instance."""
    return client["health_db"]
