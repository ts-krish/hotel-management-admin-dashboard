"use client"

const page = () => {
  return <>
    <div className="border-2">
      <form action="">
        <label htmlFor="email">Email : </label>
        <input type="email" name="email" /> <br />
        <label htmlFor="password">Password : </label>
        <input type="password" name="password" />
        <button type="button">Sign In</button>n
      </form>
    </div>
  </>;
};

export default page;
