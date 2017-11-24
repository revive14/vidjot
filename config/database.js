if(process.env.NODE_ENV === 'production'){
  module.exports = {mongoURI:'mongodb://<hamza>:<hamza>@ds119306.mlab.com:19306/vidjot-prod12'}
}else{
  module.exports = {mongoURI:'mongodb://localhost/vidjot-dev'}
}
