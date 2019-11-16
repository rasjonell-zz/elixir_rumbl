defmodule RumblWeb.VideoChannel do
  use RumblWeb, :channel

  def join("videos:" <> video_id, _params, socket) do
    {:ok, assign(socket, :video_id, String.to_integer(video_id))}
  end

  def handle_in("new_annotation", %{"body" => body, "at" => at}, socket) do
    broadcast!(socket, "new_annotation", %{
      user: %{username: "anonymous"},
      body: body,
      at: at
    })

    {:reply, :ok, socket}
  end
end
