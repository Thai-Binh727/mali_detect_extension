from flask import Flask, request, jsonify
from flask_cors import CORS

from Environment.path import *
from Models.load_models import load_model, predict_all_model
from Server.Check_safe_site import Check_site, Check_tld
from Server.database import checkAvailable

app = Flask(__name__)
CORS(app)

@app.route("/check-url", methods=["POST"])
def check_url():
    data = request.get_json()
    url = data.get("url", "")

    if Check_site(url):
        return jsonify({
            "url": url,
            "isMalicious": False,
        })

    if Check_tld(url):
        return jsonify({
            "url": url,
            "isMalicious": False,
        })

    document = checkAvailable(url)
    if document:
        print('found')
        return jsonify({
            "url": url,
            "isMalicious": True,
        })
    else:
        is_malicious = predict_all_model(models, url)
        print(is_malicious)
        return jsonify({
            "url": url,
            "isMalicious": is_malicious,
        })


if __name__ == "__main__":
    model_path = [AdaBoost, DecisionTree, KNN, LDA, RandomForest]
    models = [load_model(path) for path in model_path]

    app.run(host='0.0.0.0', port=5000)
