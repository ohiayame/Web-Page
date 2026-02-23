export async function getAllPosts() {
  const res = await fetch("http://localhost:3000/posts", {
    method: "GET",
  });

  const data = await res.json();
  console.log("res: ", data);
  return data;
}

export async function getPost(id: string) {
  const res = await fetch(`http://localhost:3000/posts/${id}`, {
    method: "GET",
  });

  const data = await res.json();
  console.log(`res ${id} post:`, data);
  return data;
}
