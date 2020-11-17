# Put your app in here.
from flask import Flask, request
from operations import add, sub, mult, div

app = Flask(__name__)


OPS = {
  'add': add,
  'sub': sub,
  'mult': mult,
  'div': div,
}


@app.route('/math/<operant>')
def math_op(operant):
  a = int(request.args['a'])
  b = int(request.args['b'])
  func = OPS.get(operant)
  return str(func(a,b))


@app.route('/add')
def addition():
  a = int(request.args['a'])
  b = int(request.args['b'])
  return str(add(a,b))


@app.route('/sub')
def subtraction():
  a = int(request.args['a'])
  b = int(request.args['b'])
  return str(sub(a,b))


@app.route('/mult')
def multiplication():
  a = int(request.args['a'])
  b = int(request.args['b'])
  return str(mult(a,b))


@app.route('/div')
def division():
  a = int(request.args['a'])
  b = int(request.args['b'])
  return str(div(a,b))