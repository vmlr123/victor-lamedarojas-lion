const Item = require("../models/Item");
const { seed_db, testUserPassword } = require("../utils/seed_db");
const get_chai = require("../utils/get_chai");
const { app } = require("../app");

describe("should test CRUD operations", function () {
  before(async () => {
    const { expect, request } = await get_chai();
    this.test_user = await seed_db();
    let req = request.execute(app).get("/sessions/logon").send();
    let res = await req;
    const textNoLineEnd = res.text.replaceAll("\n", "");
    this.csrfToken = /_csrf\" value=\"(.*?)\"/.exec(textNoLineEnd)[1];
    let cookies = res.headers["set-cookie"];
    this.csrfCookie = cookies.find((element) =>
      element.startsWith("__Host-csrfToken"),
    );
    const dataToPost = {
      email: this.test_user.email,
      password: testUserPassword,
      _csrf: this.csrfToken,
    };
    req = request
      .execute(app)
      .post("/sessions/logon")
      .set("Cookie", this.csrfCookie)
      .set("content-type", "application/x-www-form-urlencoded")
      .redirects(0)
      .send(dataToPost);
    res = await req;
    cookies = res.headers["set-cookie"];
    this.sessionCookie = cookies.find((element) =>
      element.startsWith("connect.sid"),
    );
    if (!this.sessionCookie || !this.csrfCookie || !this.csrfToken) {
      throw new Error(
        `Missing required cookies/tokens: csrfCookie=${!!this.csrfCookie}, sessionCookie=${!!this.sessionCookie}, csrfToken=${!!this.csrfToken}`,
      );
    }
    expect(this.csrfToken).to.not.be.undefined;
    expect(this.sessionCookie).to.not.be.undefined;
    expect(this.csrfCookie).to.not.be.undefined;
  });
  it("should check the amount of page parts", async () => {
    const { expect, request } = await get_chai();
    const cookieParts = [
      this.csrfCookie?.split(";")[0],
      this.sessionCookie?.split(";")[0],
    ].filter(Boolean);
    if (cookieParts.length === 0) {
      throw new Error("No valid cookies to set");
    }
    req = request
      .execute(app)
      .get("/items")
      .set("Cookie", cookieParts.join("; "))
      .set("content-type", "application/x-www-form-urlencoded")
      .redirects(0)
      .send();
    res = await req;
    expect(res).to.have.status(200);

    const pageParts = res.text.split(/<tr[^>]*>/).length;

    expect(pageParts).to.equal(22);

    const items = await Item.find({ createdBy: this.test_user._id });
    expect(items.length).to.equal(20);
  });
});
