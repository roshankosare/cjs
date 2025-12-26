using Docker.DotNet;

namespace CjsApi.Infrastructure.Docker;

public static class DockerClientFactory
{
    public static DockerClient Create()
    {
        return new DockerClientConfiguration(
            new Uri(Environment.OSVersion.Platform == PlatformID.Win32NT
                ? "npipe://./pipe/docker_engine"
                : "unix:///var/run/docker.sock")
        ).CreateClient();
    }
}