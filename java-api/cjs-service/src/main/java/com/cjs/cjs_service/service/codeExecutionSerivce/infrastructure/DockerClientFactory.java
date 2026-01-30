package com.cjs.cjs_service.service.codeExecutionSerivce.infrastructure;

import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.core.DefaultDockerClientConfig;
import com.github.dockerjava.core.DockerClientImpl;
import com.github.dockerjava.httpclient5.ApacheDockerHttpClient;

import java.time.Duration;

public final class DockerClientFactory {

    private DockerClientFactory() {}

    public static DockerClient create() {

        DefaultDockerClientConfig.Builder configBuilder =
                DefaultDockerClientConfig.createDefaultConfigBuilder();

        // 🔹 Optional override (works in container & host)
        String dockerHost = System.getenv("DOCKER_HOST");

        if (dockerHost != null && !dockerHost.isBlank()) {
            configBuilder.withDockerHost(dockerHost);
        }

        DefaultDockerClientConfig config = configBuilder.build();

        System.out.println("Docker host resolved to: " + config.getDockerHost());

        ApacheDockerHttpClient httpClient =
                new ApacheDockerHttpClient.Builder()
                        .dockerHost(config.getDockerHost())
                        .sslConfig(config.getSSLConfig())
                        .connectionTimeout(Duration.ofSeconds(5))
                        .responseTimeout(Duration.ofSeconds(30))
                        .build();

        return DockerClientImpl.getInstance(config, httpClient);
    }
}
