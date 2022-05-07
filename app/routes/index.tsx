import type { MetaFunction } from "remix";

export let meta: MetaFunction = () => {
  return {
    title: "Ruairí's Site",
    description: "Welcome to Ruairí's personal site!",
  };
};

export default function Index() {
  return (
    <div className="remix__page">
      <main>
        <h2>Welcome!</h2>
      </main>
    </div>
  );
}
