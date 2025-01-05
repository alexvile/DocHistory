export default function UserBar() {
  return (
    <form action="/logout" method="post">
      <button type="submit">Exit</button>
    </form>
  );
}
