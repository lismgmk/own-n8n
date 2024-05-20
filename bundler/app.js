export default async function (context) {
  const { page } = context;
  const rndNumber = () => {
    return Math.floor(Math.random() * (10 ** 6 - 0));
  };

  await page.goto('https://example.com/');
  const url = await page.title();
  const numbers = [...Array(5)].map(() => rndNumber());

  return {
    data: {
      url,
      numbers,
    },
    // Make sure to match the appropriate content here
    type: 'application/json',
  };
}
