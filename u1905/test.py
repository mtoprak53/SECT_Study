from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):

    def setUp(self):
        """Stuff to do before every test."""

        self.client = app.test_client()
        app.config['TESTING'] = True        

    def test_1(self):
        """ Check session and HTML """

        with self.client:
            resp = self.client.get('/')
            html = resp.get_data(as_text=True)

            self.assertEqual(resp.status_code, 200)
            self.assertIn('<div id="highest-score" class="row justify-content-center">', html)

            self.assertIn('board', session)
            self.assertIsNone(session.get('high-score'))
            self.assertIsNone(session.get('play-count'))
            self.assertIn('<p>High Score: ', html)
            self.assertIn('<p>Score: ', html)
            self.assertIn('Seconds Left: <span', html)


    def test_2(self):
        """Test the valid word"""

        with self.client as client:
            with client.session_transaction() as sess:
                sess['board'] = [["C", "A", "T", "T", "T"],
                                 ["C", "A", "T", "T", "T"],
                                 ["C", "A", "T", "T", "T"],
                                 ["C", "A", "T", "T", "T"],
                                 ["C", "A", "T", "T", "T"]]                
            resp = self.client.get('/add-word?word=cat')
            self.assertEqual(resp.json['result'], 'ok')

    def test_3(self):
        """Test the word not on the board"""
        
        self.client.get('/')
        resp = self.client.get("/add-word?word=impossible")
        self.assertEqual(resp.json['result'], 'not-on-board')

    def test_4(self):
        """Test the not-word"""

        self.client.get('/')
        resp = self.client.get("/add-word?word=lakdufhljcvasdfgadihf")
        self.assertEqual(resp.json['result'], 'not-word')




