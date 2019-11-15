alias Rumbl.Multimedia

for category <- ~w(Action Drama Romance Comedy Sci-Fi Tech) do
  Multimedia.create_category!(category)
end
