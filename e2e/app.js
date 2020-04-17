const supertest = require('supertest');


async function e2e() {
    const api = supertest('http://api:5000');

    // Empty login data
    await api
        .post('/login')
        .expect({error: 'Missing credentials'})
        .expect(401);

    // Invalid login data
    await api
        .post('/login')
        .send({
            email: 'Invalid',
            password: 'Invalid'
        })
        .expect({error: 'User not found'})
        .expect(401);

    // Login
    const loginResponse = await api
        .post('/login')
        .send({
            email: 'ceo@company.com',
            password: '123456'
        })
        .expect(200)
        .expect('Content-Type', /json/);

    const token = loginResponse.body;
    console.log('Token:', token);

    // My Workspaces Error
    await api
        .get('/my_workspaces')
        .expect(401);

    // My Workspaces
    const myWorkspacesResponse = await api
        .get('/my_workspaces')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /json/);

    const myWorkspaces = myWorkspacesResponse.body;
    console.log('My workspaces:', myWorkspaces.map(x => x.name));

    // Set Workspace
    const setWorkspaceResponse = await api
        .post(`/set_workspace/${myWorkspaces[1]._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /json/);

    const tokenWithWorkspace = setWorkspaceResponse.body;
    console.log('Token with workspace:', tokenWithWorkspace);

    // Workspace Ideas
    const workspaceIdeasResponse = await api
        .get('/ideas')
        .set('Authorization', `Bearer ${tokenWithWorkspace}`)
        .expect(200)
        .expect('Content-Type', /json/);

    const workspaceIdeas = workspaceIdeasResponse.body;
    console.log('Workspace ideas:', workspaceIdeas.map(x => x.name));

    // My Ideas
    const myIdeasResponse = await api
        .get('/my_ideas')
        .set('Authorization', `Bearer ${tokenWithWorkspace}`)
        .expect(200)
        .expect('Content-Type', /json/);

    const myIdeas = myIdeasResponse.body;
    console.log('My ideas:', myIdeas.map(x => x.name));
}

e2e().catch(e => {
    console.log('Error:', e);
    process.exit(1);
});
