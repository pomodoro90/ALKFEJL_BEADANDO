FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["BookCatalog.API.csproj", "./"]
RUN dotnet restore "BookCatalog.API.csproj"

COPY . .
RUN dotnet publish "BookCatalog.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "BookCatalog.API.dll"]