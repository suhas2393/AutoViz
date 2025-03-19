from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

# initial route
@app.route('/')
def start():
    return "Flask is connected successfully!!!"

if __name__ == '__main__':
    app.run(debug=True)