defmodule RumblWeb.VideoView do
  use RumblWeb, :view

  def category_select_options(category) do
    for category <- category, do: {category.name, category.id}
  end
end
