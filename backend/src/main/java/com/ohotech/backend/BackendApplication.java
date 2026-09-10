package com.ohotech.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

@SpringBootApplication
@EnableAsync
@EnableScheduling
public class BackendApplication {

	public static void main(String[] args) {
		loadLocalEnvironment();
		SpringApplication.run(BackendApplication.class, args);
	}

	/**
	 * Safely loads environment variable overrides from .env.local or .env if not already set in OS environment.
	 * Never logs or exposes credential values.
	 */
	private static void loadLocalEnvironment() {
		String[] possiblePaths = { ".env.local", ".env", "../.env.local", "../.env" };
		for (String path : possiblePaths) {
			File envFile = new File(path);
			if (envFile.exists() && envFile.isFile()) {
				try {
					List<String> lines = Files.readAllLines(Paths.get(path));
					for (String line : lines) {
						String trimmed = line.trim();
						if (trimmed.isEmpty() || trimmed.startsWith("#") || !trimmed.contains("=")) {
							continue;
						}
						int idx = trimmed.indexOf('=');
						String key = trimmed.substring(0, idx).trim();
						String value = trimmed.substring(idx + 1).trim();
						if (value.startsWith("\"") && value.endsWith("\"") && value.length() >= 2) {
							value = value.substring(1, value.length() - 1);
						}
						if (System.getenv(key) == null && System.getProperty(key) == null) {
							System.setProperty(key, value);
						}
					}
				} catch (Exception e) {
					// Safe non-blocking load
				}
			}
		}
	}

}
