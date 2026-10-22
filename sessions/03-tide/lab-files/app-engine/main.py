# Episode 03 Flask app. Run on the VM with: python3 app.py
from flask import Flask

app = Flask(__name__)


@app.route("/")
def home():
    return "<h1>Hello from my cloud VM 🚀</h1>"


@app.route("/about")
def about():
    return "<p>Built in VOLTIDE Episode 03.</p>"


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
