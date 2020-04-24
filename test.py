from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle

class FlaskTests(TestCase):

    def setUp(self):
        self.client = app.test_client()
        app.config['TESTING'] = True

    def test_make_board(self):
        self.assertTrue(isinstance(Boggle().make_board(), list))
        self.assertTrue(len(Boggle().make_board()) == 5)

    def test_read_dict(self):
        self.assertTrue(isinstance(Boggle().read_dict('words.txt'), list))
        self.assertTrue(len(Boggle().read_dict('words.txt')) > 0)

    def test_game_route(self):
        res = self.client.get('/')
        html = res.get_data(as_text=True)
            
        self.assertEqual(res.status_code, 200)
        self.assertIn('<table id="board">', html)        

    def test_valid_word(self):
        with self.client as client:
            with client.session_transaction() as sess:
                sess['board'] = [["C", "A", "T", "T"], ["C", "A", "T", "T"], ["C", "A", "T", "T"], ["C", "A", "T", "T"], ["C", "A", "T", "T"]]
        res = client.get('/check-word?word=cat')
        self.assertEqual(res.json['result'], 'ok')

    def test_invalid_word(self):
        self.client.get('/')
        res = self.client.get('/check-word?word=abarticulation')
        self.assertEqual(res.json['result'], 'not-on-board')

    def test_not_word(self):
        self.client.get('/')
        res = self.client.get('/check-word?word=thisisnotaword')
        self.assertEqual(res.json['result'], 'not-word')