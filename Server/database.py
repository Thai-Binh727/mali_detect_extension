from dotenv import load_dotenv
import os
from urllib.parse import quote_plus
from Environment.path import dotenv_path
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

from Extract_features.ExtractFeatures import getDomain

load_dotenv(dotenv_path)

username = quote_plus(os.environ.get('MONGODB_USER'))
password = quote_plus(os.environ.get('MONGODB_PWD'))

uri = f"mongodb+srv://{username}:{password}@maliwebdetect.8tzl3.mongodb.net/?retryWrites=true&w=majority&appName=MaliWebDetect"

client = MongoClient(uri, server_api=ServerApi('1'))

db = client['URLs']
urls_collection = db['urls']
mali_urls = db['mali_urls']

def checkAvailable(url):
    domain = getDomain(url)
    doc = mali_urls.find_one({"domain": domain})
    if doc and "urls" in doc and url in doc["urls"]:
        return True
    else:
        return False