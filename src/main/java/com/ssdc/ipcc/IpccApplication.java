package com.ssdc.ipcc;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;

import java.io.File;

@SpringBootApplication
public class IpccApplication extends SpringBootServletInitializer {

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		return application.sources(IpccApplication.class);
	}

	public static void main(String[] args) {
//		String path = "../outbound";
//
//		final File file = new File(path);
//		file.setReadable(true, false);
//		file.setExecutable(true, false);
//		file.setWritable(true, false);
		SpringApplication.run(IpccApplication.class, args);
	}
}
