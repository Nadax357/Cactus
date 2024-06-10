defmodule Myapp.DataFetcher do
  use GenServer

  @interval :timer.seconds(10)

  def start_link(_) do
    GenServer.start_link(__MODULE__, %{}, name: __MODULE__)
  end

  def init(state) do
    schedule_fetch()
    {:ok, state}
  end

  def handle_info(:fetch_data, state) do
    fetch_and_broadcast_data()
    schedule_fetch()
    {:noreply, state}
  end

  defp schedule_fetch do
    Process.send_after(self(), :fetch_data, @interval)
  end

  defp fetch_and_broadcast_data do
    url = "http://localhost:8080/metrics"

    case HTTPoison.get(url) do
      {:ok, %HTTPoison.Response{status_code: 200, body: body}} ->
        IO.puts("Data fetched: #{body}")
      {:ok, %HTTPoison.Response{status_code: status_code}} ->
        IO.puts("Received unexpected status code: #{status_code}")

      {:error, %HTTPoison.Error{reason: reason}} ->
        IO.puts("HTTP request error: #{reason}")
    end
  end
end
