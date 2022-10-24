export default async function delay(milliseconds = 500): Promise<void> {
  await new Promise<void>((resolve): void => {
    setTimeout(resolve, milliseconds);
  });
}
