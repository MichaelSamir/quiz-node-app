if(process.env.NODE_ENV === 'production'){
    module.exports = {mongoURI: 'mongodb://CHANGEME'}
  } else if(process.env.NODE_ENV === 'test'){
    module.exports = {mongoURI: 'mongodb://localhost/quiz-test'}
  } else {
    module.exports = {mongoURI: 'mongodb://localhost/quiz-dev'}
  }