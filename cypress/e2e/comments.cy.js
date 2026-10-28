describe("Gerenciamento de comentários", () => {
  it("Dado que existem comentários cadastrados, quando eu consultar /comments, então devem ser retornados 500 comentários com os campos obrigatórios", () => {
    cy.request("/comments").then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an("array").and.have.length(500);
      expect(res.body[0]).to.have.all.keys("postId", "id", "name", "email", "body");
    });
  });

  it("Dado que o comentário 1 existe, quando eu consultar /comments/1, então devem ser retornados o comentário e a identificação do seu post", () => {
    cy.request("/comments/1").then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.have.all.keys("postId", "id", "name", "email", "body");
      expect(res.body.id).to.eq(1);
      expect(res.body.postId).to.eq(1);
    });
  });

  it("Dado que eu tenho os dados de um novo comentário, quando eu enviar um POST para /comments, então o comentário deve ser criado com id 501", () => {
    const novoComentario = {
      postId: 1,
      name: "Meu comentário de teste",
      email: "teste@exemplo.com",
      body: "Conteúdo criado via BDD",
    };

    cy.request("POST", "/comments", novoComentario).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body).to.include(novoComentario);
      expect(res.body.id).to.eq(501);
    });
  });

  it("Dado que eu tenho os dados completos do comentário 1, quando eu enviar um PUT para /comments/1, então o comentário deve ser substituído", () => {
    const comentarioAtualizado = {
      postId: 1,
      id: 1,
      name: "Comentário atualizado",
      email: "atualizado@exemplo.com",
      body: "Corpo atualizado",
    };

    cy.request("PUT", "/comments/1", comentarioAtualizado).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.deep.equal(comentarioAtualizado);
    });
  });

  it("Dado que o comentário 1 existe, quando eu enviar um DELETE para /comments/1, então deve ser retornado status 200 com corpo vazio", () => {
    cy.request("DELETE", "/comments/1").then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.deep.equal({});
    });
  });
});
