package com.ohotech.backend.repository;

import com.ohotech.backend.entity.ObserverDevice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ObserverDeviceRepository extends JpaRepository<ObserverDevice, Long> {

    Optional<ObserverDevice> findByTokenHash(String tokenHash);

    List<ObserverDevice> findAllByStatus(String status);
}
