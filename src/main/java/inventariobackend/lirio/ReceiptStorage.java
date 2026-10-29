package inventariobackend.lirio;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.support.*;
import org.springframework.core.io.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import javax.imageio.*;
import javax.imageio.stream.ImageInputStream;
import java.awt.image.BufferedImage;
import java.nio.file.*;
import java.util.*;

@Service
public class ReceiptStorage {
    private final Path root;
    public ReceiptStorage(@Value("${lirio.receipts-directory}") String folder) { root=Path.of(folder).toAbsolutePath().normalize(); }
    public String store(MultipartFile file) {
        if(file.getSize()>3*1024*1024) throw StoreService.invalid("El comprobante debe pesar como máximo 3 MB");
        String name=UUID.randomUUID()+".png"; Path target=root.resolve(name);
        try (ImageInputStream in=ImageIO.createImageInputStream(file.getInputStream())) {
            Iterator<ImageReader> readers=ImageIO.getImageReaders(in);
            if(!readers.hasNext()) throw StoreService.invalid("Sube una imagen PNG o JPEG válida");
            ImageReader reader=readers.next();
            try {
                reader.setInput(in);
                String format=reader.getFormatName().toLowerCase(Locale.ROOT);
                if(!Set.of("png","jpeg","jpg").contains(format) || (long)reader.getWidth(0)*reader.getHeight(0)>12000000)
                    throw StoreService.invalid("Usa PNG o JPEG de hasta 12 megapíxeles");
                BufferedImage image=reader.read(0); Files.createDirectories(root);
                ImageIO.write(image,"png",target.toFile());
            } finally { reader.dispose(); }
            if(TransactionSynchronizationManager.isSynchronizationActive()) TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
                @Override public void afterCompletion(int status) { if(status!=STATUS_COMMITTED) { try { Files.deleteIfExists(target); } catch(Exception e) { org.slf4j.LoggerFactory.getLogger(ReceiptStorage.class).warn("No se pudo limpiar un comprobante sin pedido"); } } }
            });
            return name;
        } catch(ResponseStatusException e) { throw e; }
        catch(Exception e) { throw StoreService.invalid("No se pudo leer el comprobante. Usa otra imagen PNG o JPEG."); }
    }
    public Resource read(String name) {
        if(name==null || !name.matches("[a-f0-9-]{36}\\.png")) throw StoreService.missing();
        Path file=root.resolve(name).normalize();
        if(!file.startsWith(root) || !Files.isRegularFile(file)) throw StoreService.missing();
        return new FileSystemResource(file);
    }
}
