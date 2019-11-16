defmodule RumblWeb.AnnotationView do
  use RumblWeb, :view

  def render("annotation.json", %{annotation: annotation}) do
    %{
      id: annotation.id,
      at: annotation.at,
      body: annotation.body,
      user: render_one(annotation.user, RumblWeb.UserView, "user.json")
    }
  end
end
