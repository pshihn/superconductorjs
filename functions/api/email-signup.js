export async function onRequestPost(context) {
  try {
    let input = await context.request.formData();

    let output = {};
    for (let [key, value] of input) {
      let tmp = output[key];
      if (tmp === undefined) {
        output[key] = value;
      } else {
        output[key] = [].concat(tmp, value);
      }
    }


    let message = 'No email provided';
    const email = output.email;
    console.log('email', email);
    console.log('context.env.SUPERCONDB', context.env.SUPERCONDB);
    console.log('context.env.DB', context.env.DB || 'no db');
    if (email) {
      const { success } = await context.env.SUPERCONDB.prepare(`
        insert into mailing-list (email) values (?)
      `).bind(email).run();
      message = success ? 'Email added' : 'Error adding email';
    }

    let pretty = JSON.stringify({ message }, null, 2);
    return new Response(pretty, {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
}