#This project is hosted on Vercel(Client App) and Render(Server)

Since no database wes specified, for test purpose, the data is stored on the server app only.

Test Credentials : 

For Admin Login : 

userName = admin
password = admin

For Instructor Login:

userName = Instructor1
password = 123




List of routes :

router.post('/adminLogin', async function(req, res){...});

  router.post('/instructorLogin', async function(req, res){...});

  router.post('/checkAdminTokenValid', async function (req, res){...});

router.post('/upload', upload.single('image'), (req, res) => {...});

  router.get('/getCourses', async function (req, res){...});

  router.post('/addLecture', async function(req, res){...})

  router.post('/addInstructor', async function(req, res){...})

  router.post('/assignLecture', async function(req, res){...})
